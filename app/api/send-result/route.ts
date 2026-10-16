import { NextResponse } from 'next/server';
import nodemailer, { SendMailOptions } from 'nodemailer';

export interface QuestionResultItem {
  id: string;
  topic: string;
  question: string;
  userAnswerIndex: number | null;
  userAnswerText: string;
  correctAnswerIndex: number;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SendResultRequest {
  email?: string;
  candidateName?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  tierTitle: string;
  mode?: string;
  topicStats?: Array<{
    topic: string;
    total: number;
    answered: number;
    correct: number;
    percentage: number;
  }>;
  questionResults?: QuestionResultItem[];
}

const DEFAULT_ADMIN_EMAIL = 'sk1420000@gmail.com';

function formatDuration(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
}

function generateHtmlScorecard(data: SendResultRequest, targetEmail: string): string {
  const {
    email: candidateEmail,
    candidateName,
    score,
    totalQuestions,
    percentage,
    timeSpentSeconds,
    tierTitle,
    mode = 'Practice',
    topicStats = [],
    questionResults = [],
  } = data;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const correctCount = score;
  const incorrectCount = questionResults.filter((q) => q.userAnswerIndex !== null && !q.isCorrect).length;
  const unansweredCount = questionResults.filter((q) => q.userAnswerIndex === null).length;

  // Topic rows table
  const topicRowsHtml = topicStats
    .map((stat) => {
      const barColor =
        stat.percentage >= 80 ? '#10b981' : stat.percentage >= 50 ? '#f59e0b' : '#ef4444';
      return `
        <tr>
          <td style="padding: 10px 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; font-weight: 500;">
            ${stat.topic}
          </td>
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9; text-align: center; font-family: monospace;">
            ${stat.correct} / ${stat.total}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; width: 140px;">
            <div style="background-color: #e2e8f0; height: 8px; border-radius: 9999px; overflow: hidden; width: 100%;">
              <div style="background-color: ${barColor}; width: ${stat.percentage}%; height: 100%; border-radius: 9999px;"></div>
            </div>
            <div style="font-size: 11px; font-weight: 600; color: ${barColor}; text-align: right; margin-top: 3px;">
              ${stat.percentage}%
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  // ALL 30 Questions Complete Audit List
  const allQuestionsHtml = questionResults
    .map((q, idx) => {
      const isAnswered = q.userAnswerIndex !== null;
      const statusBadge = q.isCorrect
        ? '<span style="background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">✓ Correct</span>'
        : isAnswered
        ? '<span style="background-color: #ffe4e6; color: #be123c; border: 1px solid #fecdd3; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">✗ Incorrect</span>'
        : '<span style="background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">⚠️ Unanswered</span>';

      const borderLeftColor = q.isCorrect ? '#10b981' : isAnswered ? '#f43f5e' : '#f59e0b';

      return `
        <div style="margin-bottom: 16px; padding: 16px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 5px solid ${borderLeftColor};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 12px; font-weight: 700; color: #4f46e5; text-transform: uppercase;">
              Q${idx + 1} · ${q.topic}
            </span>
            ${statusBadge}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 10px; line-height: 1.45;">
            ${q.question}
          </div>
          <div style="font-size: 13px; margin-bottom: 5px; color: ${q.isCorrect ? '#15803d' : isAnswered ? '#b91c1c' : '#92400e'};">
            <strong>Candidate Choice:</strong> ${q.userAnswerText || 'Not Answered'}
          </div>
          ${
            !q.isCorrect
              ? `<div style="font-size: 13px; margin-bottom: 8px; color: #047857;">
                  <strong>Correct Answer:</strong> ${q.correctAnswerText}
                </div>`
              : ''
          }
          <div style="font-size: 12px; color: #475569; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9; line-height: 1.4; margin-top: 8px;">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Python MCQ Arena - Final Result</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 680px; margin: 0 auto; padding: 24px 16px;">
    
    <!-- Top Header Brand -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #306998 0%, #4f46e5 100%); padding: 12px 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);">
        <span style="font-size: 24px; vertical-align: middle;">🐍</span>
        <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-left: 8px; vertical-align: middle;">
          Python MCQ Arena · Final Exam Result
        </span>
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
        Automatic Final Submission Report delivered to <strong>${targetEmail}</strong>
      </div>
    </div>

    <!-- Main Scorecard Card -->
    <div style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px;">
      
      <!-- Top Banner -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; padding: 6px 14px; background-color: rgba(255, 255, 255, 0.15); border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffd43b; margin-bottom: 12px;">
          ${tierTitle}
        </div>
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">
          ${score} / ${totalQuestions} (${percentage}%)
        </h1>
        <div style="margin-top: 12px; font-size: 14px; color: #cbd5e1;">
          Candidate: <strong style="color: #ffffff;">${candidateName || 'Anonymous Student'}</strong>
          ${candidateEmail ? ` &lt;${candidateEmail}&gt;` : ''}
        </div>
        <div style="margin-top: 4px; font-size: 12px; color: #94a3b8;">
          Submitted on: <strong>${dateStr}</strong> · Mode: <strong>${mode.toUpperCase()}</strong>
        </div>
      </div>

      <!-- Executive Metrics Bar -->
      <div style="display: table; width: 100%; border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
        <div style="display: table-cell; width: 25%; padding: 16px 8px; text-align: center; border-right: 1px solid #f1f5f9;">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Accuracy</div>
          <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 2px;">
            ${percentage}%
          </div>
        </div>
        <div style="display: table-cell; width: 25%; padding: 16px 8px; text-align: center; border-right: 1px solid #f1f5f9;">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Correct</div>
          <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 2px;">
            ${correctCount}
          </div>
        </div>
        <div style="display: table-cell; width: 25%; padding: 16px 8px; text-align: center; border-right: 1px solid #f1f5f9;">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Incorrect / Skipped</div>
          <div style="font-size: 20px; font-weight: 800; color: #e11d48; margin-top: 2px;">
            ${incorrectCount + unansweredCount}
          </div>
        </div>
        <div style="display: table-cell; width: 25%; padding: 16px 8px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Time Spent</div>
          <div style="font-size: 20px; font-weight: 800; color: #4f46e5; margin-top: 2px;">
            ${formatDuration(timeSpentSeconds)}
          </div>
        </div>
      </div>

      <!-- W3Schools Topic Breakdown Table -->
      ${
        topicStats.length > 0
          ? `
        <div style="padding: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
            Topic Mastery Breakdown (${topicStats.length} Topics)
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Topic</th>
                <th style="padding: 8px 14px; text-align: center; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Score</th>
                <th style="padding: 8px 14px; text-align: right; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Mastery</th>
              </tr>
            </thead>
            <tbody>
              ${topicRowsHtml}
            </tbody>
          </table>
        </div>
      `
          : ''
      }

    </div>

    <!-- Complete 30-Question Audit Report -->
    <div style="margin-bottom: 24px;">
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">
          Complete Detailed Question Audit (${questionResults.length} Questions)
        </h2>
        <span style="font-size: 12px; color: #64748b;">
          Every submitted answer, correct answer, and explanation
        </span>
      </div>
      ${allQuestionsHtml}
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-bottom: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #64748b;">
        Python MCQ Arena · Automated Exam Report Engine
      </p>
      <p style="margin: 0;">
        Sent to: <strong>${targetEmail}</strong> ${candidateEmail ? `· Candidate: ${candidateEmail}` : ''}
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    const body: SendResultRequest = await request.json();

    const { score, totalQuestions, percentage } = body;

    // The primary recipient configured via ENV or default to sk1420000@gmail.com
    const targetRecipient = process.env.RESULT_RECIPIENT_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;

    const htmlContent = generateHtmlScorecard(body, targetRecipient);
    const textContent = `Python MCQ Arena Final Submission Report\n\nRecipient: ${targetRecipient}\nCandidate: ${body.candidateName || 'Anonymous'} (${body.email || 'No email provided'})\nScore: ${score}/${totalQuestions} (${percentage}%)\nTier: ${body.tierTitle}\nTime: ${formatDuration(body.timeSpentSeconds)}\n\nIncludes detailed question-by-question audit of all ${totalQuestions} questions.`;

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpFrom = process.env.SMTP_FROM || 'Python MCQ Arena <noreply@mcqarena.com>';

    // Check if SMTP is configured
    const isSmtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

    if (process.env.DEBUG_EMAIL === 'true') {
      console.log('📧 [send-result API] Automatic submit dispatch to:', targetRecipient);
      console.log('📧 [send-result API] Candidate:', body.candidateName, body.email);
      console.log('📧 [send-result API] SMTP Configured:', isSmtpConfigured);
      if (!isSmtpConfigured) {
        console.log('📧 [send-result API] Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local to deliver live emails to sk1420000@gmail.com');
      }
    }

    if (isSmtpConfigured) {
      // Create real nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
      });

      // Send to sk1420000@gmail.com (and CC candidate if valid email provided)
      const mailOptions: SendMailOptions = {
        from: smtpFrom,
        to: targetRecipient,
        subject: `🐍 [Final Submission] ${body.candidateName || 'Candidate'} scored ${score}/${totalQuestions} (${percentage}%) - ${body.tierTitle}`,
        text: textContent,
        html: htmlContent,
      };

      if (body.email && body.email.includes('@') && body.email.trim() !== targetRecipient) {
        mailOptions.cc = body.email.trim();
      }

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        preview: false,
        recipient: targetRecipient,
        message: `Final result with all 30 questions successfully delivered to ${targetRecipient}!`,
      });
    }

    // If SMTP is not yet configured, return preview mode success with clear explanation
    return NextResponse.json({
      success: true,
      preview: true,
      recipient: targetRecipient,
      message: `Final result with all 30 question details queued for ${targetRecipient}! (To enable live email delivery, configure SMTP_HOST, SMTP_USER & SMTP_PASS in .env.local)`,
      previewDetails: {
        to: targetRecipient,
        candidateName: body.candidateName || 'Anonymous',
        candidateEmail: body.email || 'None',
        score: `${score}/${totalQuestions} (${percentage}%)`,
        tier: body.tierTitle,
        timeSpent: formatDuration(body.timeSpentSeconds),
        totalDetailsIncluded: body.questionResults?.length || totalQuestions,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error sending email';
    console.error('❌ [send-result API Error]:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: `Email transmission error: ${errorMessage}. Please check your SMTP configuration in .env.local.`,
      },
      { status: 500 }
    );
  }
}
